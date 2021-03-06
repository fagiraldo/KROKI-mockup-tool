package kroki.mockup.model.components;

import java.awt.Dimension;

import kroki.mockup.model.Component;
import kroki.mockup.utils.KrokiTextMeasurer;
import kroki.mockup.view.painters.components.TextFieldPainter;

/**
 * Class which represents a textual field
 * @author Vladan Marsenić (vladan.marsenic@gmail.com)
 */
@SuppressWarnings("serial")
public class TextField extends Component {

    private int cols;
    private int gap = 5;
    private int blank = 0;
    private static final int MIN_COLS = 5;
    private static final int MIN_ROWS = 1;
    private Dimension labelDim = new Dimension();
    private Dimension fieldDim = new Dimension();

    public TextField(String name) {
        super(name);
        calculateDim();
        elementPainter = new TextFieldPainter(this);
    }

    public TextField() {
        super();
        calculateDim();
        elementPainter = new TextFieldPainter(this);
    }

    public TextField(String name, int cols) {
        super();
        this.name = name;
        this.cols = cols;
        calculateDim();
        elementPainter = new TextFieldPainter(this);
    }

    public TextField(int cols) {
        super();
        this.cols = cols;
        calculateDim();
        elementPainter = new TextFieldPainter(this);
    }

    /**
     * Calculates dimension of space filled by the text, taking into account the empty space between
     * the input field and the text
     */
    private Dimension calculateLabelDim() {
        Dimension dim = new Dimension();
        if (name != null && !name.equals("")) {
            dim = KrokiTextMeasurer.measureText(name, getFont());
            /*
            int cell = 10;
            int mod = dim.width % cell;
            if (mod > 0) {
                blank = cell - mod;
                dim.width += blank;
            }
            dim.width += gap;
            */
            dim.width += gap+blank;
        }
        return dim;
    }

    /**
     * Calculates dimension of the input field
     */
    private Dimension calculateFieldDim() {
        Dimension dim = KrokiTextMeasurer.measureText("M", getFont());
        dim.width *= (cols > 0) ? cols : MIN_COLS;
        dim.height *= MIN_ROWS;

//        int cell = 10;
//        int mod = dim.width % cell;
//        if (mod > 0) {
//            dim.width += cell - mod;
//        }

        dim.width += margins.left + margins.right;
        dim.height += margins.top + margins.bottom;
        return dim;
    }

    /**
     * Calculates the minimal dimension of the input field
     */
    private Dimension calculateMinFieldDim() {
        Dimension dim = KrokiTextMeasurer.measureText("M", getFont());
        dim.width *= MIN_COLS;
        dim.height *= MIN_ROWS;

//        int cell = 10;
//        int mod = dim.width % cell;
//        if (mod > 0) {
//            dim.width += cell - mod;
//        }

        dim.width += margins.left + margins.right;
        dim.height += margins.top + margins.bottom;
        return dim;
    }

    private void calculateDim() {
        dimension = new Dimension();
        labelDim = calculateLabelDim();
        fieldDim = calculateFieldDim();
        dimension.width += labelDim.width;
        dimension.width += fieldDim.width;
        dimension.height = Math.max(labelDim.height, fieldDim.height);
        dimension.width += insets.left + insets.right;
        dimension.height += insets.top + insets.bottom;

    }

    @Override
    public Dimension getMaximumSize() {
        Dimension max = new Dimension();
        max.width = Integer.MAX_VALUE;
        max.height = getMinimumSize().height;
        return max;
    }

    @Override
    public Dimension getMinimumSize() {
        Dimension min = new Dimension();
        Dimension minLabelDim = calculateLabelDim();
        Dimension minFieldDim = calculateMinFieldDim();
        min.width += minLabelDim.width;
        min.width += minFieldDim.width;
        min.height = Math.max(minLabelDim.height, minFieldDim.height);
        min.width += insets.left + insets.right;
        min.height += insets.top + insets.bottom;
        return min;
    }

    @Override
    public void updateComponent() {
        Dimension minSize = getMinimumSize();
        Dimension maxSize = getMaximumSize();
        if (dimension.width < minSize.width) {
            dimension.width = minSize.width;
        } else if (dimension.width > maxSize.width) {
            dimension.width = maxSize.width;
        }
        if (dimension.height < minSize.height) {
            dimension.height = minSize.height;
        } else if (dimension.height > maxSize.width) {
            dimension.height = maxSize.height;
        }
        updateTextField();
        elementPainter.update();
    }

    /**
     * Takes into account changes made to the component and calculates the new dimension
     * of the label
     */
    private void updateLabel() {
        labelDim = calculateLabelDim();
    }

    /**
     * Takes into account changes made to the component and calculates the new dimension
     * of input text field
     */
    /**Uzima u obzir promene nad komponentom i izraÄ�unava novu dimenziju koju zauzima tekstualno polje*/
    private void updateField() {
        int fieldWidth = dimension.width - labelDim.width - insets.left - insets.right;
        int fieldHeight = dimension.height - insets.top - insets.bottom;

//        int cell = 10;
//        int mod = fieldWidth % cell;
//        if (mod > 0) {
//            fieldWidth += cell - mod;
//        }
        
        fieldDim.width = fieldWidth;
        fieldDim.height = fieldHeight;
    }

    /**
     * Takes into account changes made to the component and calculates the new dimension
     * whole component
     */
    private void updateTextField() {
        updateLabel();
        updateField();
        dimension.width = insets.left + labelDim.width + fieldDim.width + insets.right;
        dimension.height = insets.top + insets.bottom + Math.max(labelDim.height, fieldDim.height);
    }

    public int getCols() {
        return cols;
    }

    public void setCols(int cols) {
        this.cols = cols;
    }

    public int getGap() {
        return gap;
    }

    public void setGap(int gap) {
        this.gap = gap;
    }

    public Dimension getFieldDim() {
        return fieldDim;
    }

    public void setFieldDim(Dimension fieldDim) {
        this.fieldDim = fieldDim;
    }

    public Dimension getLabelDim() {
        return labelDim;
    }

    public void setLabelDim(Dimension labelDim) {
        this.labelDim = labelDim;
    }

    public int getBlank() {
        return blank;
    }

    public void setBlank(int blank) {
        this.blank = blank;
    }
}
